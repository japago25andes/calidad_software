"""Plugin de pytest del simulador (como pytest-playwright): da el fixture `page`."""
import time

import pytest

from playwright.sync_api import Page, _call


@pytest.fixture
def base_url():
    return "https://pixelshop.test"


@pytest.fixture
def page(request):
    # Cada prueba arranca con una pestaña nueva de PixelShop (sin sesión ni carrito).
    _call("reset", test=request.node.name)
    yield Page()
    _call("endTest")


@pytest.fixture(autouse=True)
def _virtual_sleep(monkeypatch):
    # time.sleep() no congela el navegador: avanza el reloj de la app y queda anotado.
    def sleep(seconds):
        _call("wait", ms=float(seconds) * 1000, sleep=True)

    monkeypatch.setattr(time, "sleep", sleep)
