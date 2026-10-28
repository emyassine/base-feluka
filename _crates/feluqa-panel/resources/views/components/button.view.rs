@if (color == "primary")
<button class="fi-btn fi-size-md fi-color fi-color-primary fi-bg-color-400 hover:fi-bg-color-300 dark:fi-bg-color-600 dark:hover:fi-bg-color-500 fi-text-color-900 hover:fi-text-color-800 dark:fi-text-color-950 dark:hover:fi-text-color-950" type="submit" @if (disabled) disabled @endif>
  @yield("default")
</button>
@elseif (color == "danger")
<button class="fi-btn fi-size-md fi-color fi-color-danger fi-bg-color-600 hover:fi-bg-color-500 dark:fi-bg-color-600 dark:hover:fi-bg-color-500 fi-text-color-0 hover:fi-text-color-0 dark:fi-text-color-0 dark:hover:fi-text-color-0" type="submit" @if (disabled) disabled @endif>
  @yield("default")
</button>
@elseif (color == "success")
<button class="fi-btn fi-size-md fi-color fi-color-success fi-bg-color-400 hover:fi-bg-color-300 dark:fi-bg-color-600 dark:hover:fi-bg-color-500 fi-text-color-900 hover:fi-text-color-800 dark:fi-text-color-950 dark:hover:fi-text-color-950" type="submit" @if (disabled) disabled @endif>
  @yield("default")
</button>
@elseif (color == "warning")
<button class="fi-btn fi-size-md fi-color fi-color-warning fi-bg-color-400 hover:fi-bg-color-300 dark:fi-bg-color-600 dark:hover:fi-bg-color-500 fi-text-color-900 hover:fi-text-color-800 dark:fi-text-color-950 dark:hover:fi-text-color-950" type="submit" @if (disabled) disabled @endif>
  @yield("default")
</button>
@elseif (color == "info")
<button class="fi-btn fi-size-md fi-color fi-color-info fi-bg-color-600 hover:fi-bg-color-500 dark:fi-bg-color-600 dark:hover:fi-bg-color-500 fi-text-color-0 hover:fi-text-color-0 dark:fi-text-color-0 dark:hover:fi-text-color-0" type="submit" @if (disabled) disabled @endif>
  @yield("default")
</button>
@else
<button class="fi-btn fi-size-md" type="submit" @if (disabled) disabled @endif>
  @yield("default")
</button>
@endif
