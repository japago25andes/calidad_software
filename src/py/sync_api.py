"""Simulador de playwright.sync_api para Misión: Calidad.

Imita la API síncrona de Playwright para Python (un subconjunto) y la ejecuta sobre la
app de práctica PixelShop, que vive en un iframe de la página. Todo el trabajo con el DOM
lo hace el puente en JavaScript (_pwbridge); aquí solo se construyen los locators.
"""
import json
import re

import _pwbridge

__all__ = ["Page", "Locator", "expect", "Error", "TimeoutError"]


class Error(Exception):
    pass


class TimeoutError(Error):  # noqa: A001 - mismo nombre que en Playwright
    pass


def _val(v):
    if isinstance(v, re.Pattern):
        return {"re": v.pattern, "flags": "i" if v.flags & re.IGNORECASE else ""}
    if isinstance(v, (list, tuple)):
        return [_val(x) for x in v]
    return v


def _call(op, **payload):
    res = json.loads(_pwbridge.call(json.dumps({"op": op, **payload})))
    if res.get("assertion"):
        raise AssertionError(res["error"])
    if res.get("error"):
        raise (TimeoutError if res.get("timeout") else Error)(res["error"])
    return res.get("value")


class _Locatable:
    _steps: list

    def _sub(self, step):
        return Locator(self._steps + [step])

    def locator(self, selector, *, has_text=None, has_not_text=None, has=None):
        loc = self._sub({"kind": "css", "selector": selector})
        if has_text is not None or has_not_text is not None or has is not None:
            loc = loc.filter(has_text=has_text, has_not_text=has_not_text, has=has)
        return loc

    def get_by_role(self, role, *, name=None, exact=False, checked=None, disabled=None, level=None, include_hidden=False, pressed=None, selected=None, expanded=None):
        return self._sub({"kind": "role", "role": role, "name": _val(name), "exact": exact, "checked": checked, "disabled": disabled, "level": level, "includeHidden": include_hidden})

    def get_by_text(self, text, *, exact=False):
        return self._sub({"kind": "text", "text": _val(text), "exact": exact})

    def get_by_label(self, text, *, exact=False):
        return self._sub({"kind": "label", "text": _val(text), "exact": exact})

    def get_by_placeholder(self, text, *, exact=False):
        return self._sub({"kind": "placeholder", "text": _val(text), "exact": exact})

    def get_by_alt_text(self, text, *, exact=False):
        return self._sub({"kind": "alt", "text": _val(text), "exact": exact})

    def get_by_title(self, text, *, exact=False):
        return self._sub({"kind": "title", "text": _val(text), "exact": exact})

    def get_by_test_id(self, test_id):
        return self._sub({"kind": "testid", "text": _val(test_id)})


class Locator(_Locatable):
    def __init__(self, steps):
        self._steps = steps

    def __repr__(self):
        return f"<Locator selector='{_call('describe', steps=self._steps)}'>"

    # ── Refinar ──
    def filter(self, *, has_text=None, has_not_text=None, has=None, has_not=None):
        return self._sub({"kind": "filter", "hasText": _val(has_text), "hasNotText": _val(has_not_text), "has": has._steps if has else None, "hasNot": has_not._steps if has_not else None})

    def nth(self, index):
        return self._sub({"kind": "nth", "n": index})

    @property
    def first(self):
        return self.nth(0)

    @property
    def last(self):
        return self.nth(-1)

    def all(self):
        return [self.nth(i) for i in range(self.count())]

    # ── Acciones ──
    def _act(self, action, timeout=None, **args):
        return _call("act", steps=self._steps, action=action, args=args, timeout=timeout)

    def click(self, *, timeout=None, **_):
        self._act("click", timeout)

    def dblclick(self, *, timeout=None, **_):
        self._act("dblclick", timeout)

    def fill(self, value, *, timeout=None, **_):
        self._act("fill", timeout, value=str(value))

    def clear(self, *, timeout=None, **_):
        self._act("fill", timeout, value="")

    def press_sequentially(self, text, *, delay=None, timeout=None, **_):
        self._act("type", timeout, value=str(text))

    def type(self, text, *, delay=None, timeout=None, **_):
        self._act("type", timeout, value=str(text))

    def press(self, key, *, timeout=None, **_):
        self._act("press", timeout, key=key)

    def check(self, *, timeout=None, **_):
        self._act("check", timeout, checked=True)

    def uncheck(self, *, timeout=None, **_):
        self._act("check", timeout, checked=False)

    def set_checked(self, checked, *, timeout=None, **_):
        self._act("check", timeout, checked=bool(checked))

    def select_option(self, value=None, *, label=None, index=None, timeout=None, **_):
        return self._act("select", timeout, value=value, label=label, index=index)

    def hover(self, *, timeout=None, **_):
        self._act("hover", timeout)

    def focus(self, *, timeout=None, **_):
        self._act("focus", timeout)

    def scroll_into_view_if_needed(self, *, timeout=None, **_):
        self._act("scroll", timeout)

    def screenshot(self, *, path=None, **_):
        _call("note", text=f"📸 captura de pantalla{f' ({path})' if path else ''}")
        return b""

    # ── Consultas ──
    def _get(self, what, **args):
        return _call("query", steps=self._steps, what=what, args=args)

    def count(self):
        return _call("count", steps=self._steps)

    def text_content(self, **_):
        return self._get("textContent")

    def inner_text(self, **_):
        return self._get("innerText")

    def input_value(self, **_):
        return self._get("value")

    def get_attribute(self, name, **_):
        return self._get("attribute", name=name)

    def is_visible(self, **_):
        return self._get("visible")

    def is_hidden(self, **_):
        return not self._get("visible")

    def is_enabled(self, **_):
        return self._get("enabled")

    def is_disabled(self, **_):
        return not self._get("enabled")

    def is_checked(self, **_):
        return self._get("checked")

    def all_text_contents(self):
        return _call("all", steps=self._steps, what="textContent")

    def all_inner_texts(self):
        return _call("all", steps=self._steps, what="innerText")

    def wait_for(self, *, state="visible", timeout=None):
        _call("waitFor", steps=self._steps, state=state, timeout=timeout)


class _Keyboard:
    def press(self, key):
        _call("key", key=key)

    def type(self, text, **_):
        _call("key", text=str(text))


class _Mouse:
    def wheel(self, dx, dy):
        pass


class Page(_Locatable):
    def __init__(self):
        self._steps = []
        self.keyboard = _Keyboard()
        self.mouse = _Mouse()

    def __repr__(self):
        return f"<Page url='{self.url}'>"

    def goto(self, url, **_):
        _call("goto", url=url)

    def reload(self, **_):
        _call("reload")

    def go_back(self, **_):
        _call("back")

    @property
    def url(self):
        return _call("url")

    def title(self):
        return _call("title")

    def wait_for_timeout(self, timeout):
        _call("wait", ms=timeout)

    def wait_for_url(self, url, *, timeout=None, **_):
        _call("expectPage", kind="url", expected=_val(url), timeout=timeout, waitOnly=True)

    def wait_for_load_state(self, state="load", **_):
        pass

    def screenshot(self, *, path=None, **_):
        _call("note", text=f"📸 captura de pantalla{f' ({path})' if path else ''}")
        return b""

    def pause(self):
        _call("note", text="⏸ page.pause() (en el navegador real abriría el inspector)")

    def set_default_timeout(self, timeout):
        _call("setTimeout", ms=timeout)

    def content(self):
        return _call("content")


class _Assertions:
    def __init__(self, target, negate=False):
        self._target = target
        self._not = negate

    @property
    def not_(self):
        return type(self)(self._target, not self._not)

    def __getattr__(self, name):
        # not_to_have_text(...) == not_.to_have_text(...)
        if name.startswith("not_to_"):
            return getattr(type(self)(self._target, not self._not), name[4:])
        raise AttributeError(name)


class LocatorAssertions(_Assertions):
    def _check(self, kind, expected=None, timeout=None, **extra):
        _call("expect", steps=self._target._steps, kind=kind, expected=_val(expected), negate=self._not, timeout=timeout, **extra)

    def to_be_visible(self, *, visible=True, timeout=None):
        self._check("visible" if visible else "hidden", timeout=timeout)

    def to_be_hidden(self, *, timeout=None):
        self._check("hidden", timeout=timeout)

    def to_be_enabled(self, *, enabled=True, timeout=None):
        self._check("enabled" if enabled else "disabled", timeout=timeout)

    def to_be_disabled(self, *, timeout=None):
        self._check("disabled", timeout=timeout)

    def to_be_editable(self, *, timeout=None, **_):
        self._check("editable", timeout=timeout)

    def to_be_checked(self, *, checked=True, timeout=None):
        self._check("checked" if checked else "unchecked", timeout=timeout)

    def to_be_empty(self, *, timeout=None):
        self._check("empty", timeout=timeout)

    def to_be_focused(self, *, timeout=None):
        self._check("focused", timeout=timeout)

    def to_be_attached(self, *, attached=True, timeout=None):
        self._check("attached" if attached else "detached", timeout=timeout)

    def to_have_text(self, expected, *, use_inner_text=None, ignore_case=None, timeout=None):
        self._check("text", expected, timeout, ignoreCase=bool(ignore_case))

    def to_contain_text(self, expected, *, use_inner_text=None, ignore_case=None, timeout=None):
        self._check("containText", expected, timeout, ignoreCase=bool(ignore_case))

    def to_have_value(self, value, *, timeout=None):
        self._check("value", value, timeout)

    def to_have_count(self, count, *, timeout=None):
        self._check("count", count, timeout)

    def to_have_attribute(self, name, value, *, timeout=None, **_):
        self._check("attribute", value, timeout, name=name)

    def to_have_class(self, expected, *, timeout=None):
        self._check("class", expected, timeout)

    def to_contain_class(self, expected, *, timeout=None):
        self._check("containClass", expected, timeout)

    def to_have_accessible_name(self, name, *, timeout=None, **_):
        self._check("accessibleName", name, timeout)


class PageAssertions(_Assertions):
    def _check(self, kind, expected, timeout=None):
        _call("expectPage", kind=kind, expected=_val(expected), negate=self._not, timeout=timeout)

    def to_have_url(self, url, *, timeout=None, **_):
        self._check("url", url, timeout)

    def to_have_title(self, title, *, timeout=None):
        self._check("title", title, timeout)


def expect(actual, message=None):
    if isinstance(actual, Page):
        return PageAssertions(actual)
    if isinstance(actual, Locator):
        return LocatorAssertions(actual)
    raise Error(f"expect() solo acepta un Page o un Locator, no {type(actual).__name__}")


# Tipos que a veces se importan en las pruebas (solo para las anotaciones).
Browser = BrowserContext = Playwright = object
